// screens/ProfileScreen.js
// Government of Jharkhand Civic Portal User Profile
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Platform,
  Linking,
  RefreshControl 
} from 'react-native';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import StylishButton from '../components/StylishButton';
import LoadingSpinner from '../components/LoadingSpinner';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { Colors, Typography, Spacing, Layout, GovernmentBranding, Shadow } from '../constants/Theme';

export default function ProfileScreen() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalReports: 0,
    pendingIssues: 0,
    resolvedIssues: 0,
    memberSince: null
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch user statistics from Firestore
  const fetchUserStats = async () => {
    if (!auth.currentUser?.email) {
      setStatsLoading(false);
      return;
    }

    try {
      const userEmail = auth.currentUser.email;
      const issuesQuery = query(
        collection(db, 'issues'),
        where('reportedBy', '==', userEmail)
      );

      const querySnapshot = await getDocs(issuesQuery);
      const issues = querySnapshot.docs.map(doc => doc.data());

      const stats = {
        totalReports: issues.length,
        pendingIssues: issues.filter(issue => 
          issue.status === 'reported' || 
          issue.status === 'in-progress' || 
          issue.status === 'under-review'
        ).length,
        resolvedIssues: issues.filter(issue => 
          issue.status === 'resolved' || 
          issue.status === 'completed'
        ).length,
        memberSince: auth.currentUser?.metadata?.creationTime 
          ? new Date(auth.currentUser.metadata.creationTime) 
          : null
      };

      setUserStats(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Keep the default values if there's an error
    } finally {
      setStatsLoading(false);
    }
  };

  // Refresh function for pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserStats();
    
    // Set up real-time listener for user's issues
    if (auth.currentUser?.email) {
      const userEmail = auth.currentUser.email;
      const issuesQuery = query(
        collection(db, 'issues'),
        where('reportedBy', '==', userEmail)
      );

      const unsubscribe = onSnapshot(issuesQuery, (querySnapshot) => {
        const issues = querySnapshot.docs.map(doc => doc.data());

        const stats = {
          totalReports: issues.length,
          pendingIssues: issues.filter(issue => 
            issue.status === 'reported' || 
            issue.status === 'in-progress' || 
            issue.status === 'under-review'
          ).length,
          resolvedIssues: issues.filter(issue => 
            issue.status === 'resolved' || 
            issue.status === 'completed'
          ).length,
          memberSince: auth.currentUser?.metadata?.creationTime 
            ? new Date(auth.currentUser.metadata.creationTime) 
            : null
        };

        setUserStats(stats);
        setStatsLoading(false);
      }, (error) => {
        console.error('Error listening to user stats:', error);
        setStatsLoading(false);
      });

      // Cleanup listener on component unmount
      return () => unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      t('profile.logoutTitle'),
      t('profile.logoutMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logoutButton').replace('🚀 ', ''),
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await auth.signOut();
              Alert.alert(t('common.success'), t('profile.logoutSuccess'));
            } catch (err) {
              console.error('Logout failed: ', err);
              Alert.alert(t('common.error'), t('profile.logoutError'));
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      t('profile.contactTitle'),
      t('profile.contactMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.contactCall'),
          onPress: () => Linking.openURL('tel:1800-123-4567')
        },
        {
          text: t('profile.contactEmail'),
          onPress: () => Linking.openURL('mailto:support@jharkhand.gov.in')
        }
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      t('profile.rateTitle'),
      t('profile.rateMessage'),
      [
        { text: t('profile.rateLater'), style: 'cancel' },
        {
          text: t('profile.rateNow'),
          onPress: () => {
            // This would typically open the app store
            Alert.alert(t('common.success'), t('profile.rateThankYou'));
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <LoadingSpinner 
        text={t('profile.loggingOut')}
        variant="government" 
        showBranding={true}
      />
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      {/* Government Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.headerIcon}>🏛️</Text>
          <View style={styles.headerTextContainer}>
            <Text style={styles.governmentTitle}>{t('profile.headerTitle')}</Text>
            <Text style={styles.departmentText}>{t('profile.headerSubtitle')}</Text>
          </View>
        </View>
        
        <View style={styles.headerDivider} />
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {(auth.currentUser?.email?.charAt(0) || 'C').toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{t('profile.registeredCitizen')}</Text>
            <Text style={styles.profileEmail}>{auth.currentUser?.email}</Text>
            <View style={styles.verificationBadge}>
              <Text style={styles.verificationText}>{t('profile.verifiedAccount')}</Text>
            </View>
          </View>
        </View>
        
        {userStats.memberSince && (
          <View style={styles.membershipInfo}>
            <Text style={styles.membershipText}>
              {t('profile.memberSince', {
                date: userStats.memberSince.toLocaleDateString('en-IN', {
                  month: 'long',
                  year: 'numeric'
                })
              })}
            </Text>
          </View>
        )}
      </View>

      {/* Statistics Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>{t('profile.statsTitle')}</Text>
        {statsLoading ? (
          <View style={styles.statsLoadingContainer}>
            <LoadingSpinner 
              text={t('profile.statsLoading')}
              variant="secondary" 
              showBranding={false}
            />
          </View>
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userStats.totalReports}</Text>
              <Text style={styles.statLabel}>{t('profile.totalReports')}</Text>
              <Text style={styles.statIcon}>📄</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userStats.pendingIssues}</Text>
              <Text style={styles.statLabel}>{t('profile.inProgress')}</Text>
              <Text style={styles.statIcon}>⏳</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userStats.resolvedIssues}</Text>
              <Text style={styles.statLabel}>{t('profile.resolved')}</Text>
              <Text style={styles.statIcon}>✅</Text>
            </View>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>{t('profile.actionsTitle')}</Text>
        
        <LanguageSwitcher 
          style={styles.actionButton}
          variant="button"
          showLabel={true}
        />
        
        <StylishButton 
          title={t('profile.contactSupport')}
          onPress={handleContactSupport}
          variant="tertiary"
          size="large"
          fullWidth={true}
          style={styles.actionButton}
        />
        
        <StylishButton 
          title={t('profile.rateApp')}
          onPress={handleRateApp}
          variant="secondary"
          size="large"
          fullWidth={true}
          style={styles.actionButton}
        />
      </View>

      {/* Government Info */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>{t('profile.aboutTitle')}</Text>
        <Text style={styles.infoText}>
          {t('profile.aboutText1')}
        </Text>
        <Text style={styles.infoText}>
          {t('profile.aboutText2')}
        </Text>
      </View>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <StylishButton 
          title={t('profile.logoutButton')}
          onPress={handleLogout}
          variant="danger"
          size="large"
          fullWidth={true}
        />
        <Text style={styles.logoutNote}>
          {t('profile.logoutNote')}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('footer.digitalIndia')}</Text>
        <Text style={styles.footerSubText}>{t('footer.empoweringCitizens')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header Section
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: Spacing.large,
    paddingHorizontal: Spacing.large,
    ...Shadow.government,
  },
  
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  
  headerIcon: {
    fontSize: 32,
    marginRight: Spacing.medium,
  },
  
  headerTextContainer: {
    flex: 1,
  },
  
  governmentTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.lightText,
  },
  
  departmentText: {
    fontSize: Typography.sizes.medium,
    color: Colors.lightText,
    opacity: 0.9,
    marginTop: 2,
  },
  
  headerDivider: {
    height: 3,
    backgroundColor: Colors.gold,
    borderRadius: 2,
    alignSelf: 'center',
    width: '60%',
  },
  
  // Profile Card
  profileCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.large,
    marginTop: -Spacing.large,
    borderRadius: Spacing.large,
    padding: Spacing.xlarge,
    ...Shadow.heavy,
    borderTopWidth: 4,
    borderTopColor: Colors.gold,
  },
  
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.large,
    ...Shadow.medium,
  },
  
  avatarText: {
    fontSize: Typography.sizes.huge,
    fontWeight: Typography.weights.bold,
    color: Colors.lightText,
  },
  
  profileInfo: {
    flex: 1,
  },
  
  profileName: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.tiny,
  },
  
  profileEmail: {
    fontSize: Typography.sizes.regular,
    color: Colors.secondaryText,
    marginBottom: Spacing.small,
  },
  
  verificationBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.tiny,
    borderRadius: Spacing.medium,
    alignSelf: 'flex-start',
  },
  
  verificationText: {
    color: Colors.lightText,
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold,
  },
  
  membershipInfo: {
    backgroundColor: Colors.lightGray,
    padding: Spacing.medium,
    borderRadius: Spacing.medium,
    alignItems: 'center',
  },
  
  membershipText: {
    fontSize: Typography.sizes.medium,
    color: Colors.primaryText,
    fontWeight: Typography.weights.medium,
  },
  
  // Statistics Section
  statsSection: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.large,
    marginTop: Spacing.large,
    borderRadius: Spacing.large,
    padding: Spacing.large,
    ...Shadow.medium,
  },
  
  sectionTitle: {
    ...GovernmentBranding.sectionHeader,
    fontSize: Typography.sizes.large,
    textAlign: 'center',
    marginBottom: Spacing.large,
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  statsLoadingContainer: {
    paddingVertical: Spacing.xlarge,
    alignItems: 'center',
  },
  
  statCard: {
    backgroundColor: Colors.documentBg,
    borderRadius: Spacing.medium,
    padding: Spacing.medium,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Spacing.small,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  
  statNumber: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.tiny,
  },
  
  statLabel: {
    fontSize: Typography.sizes.small,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: Spacing.small,
  },
  
  statIcon: {
    fontSize: Typography.sizes.large,
  },
  
  // Actions Section
  actionsSection: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.large,
    marginTop: Spacing.large,
    borderRadius: Spacing.large,
    padding: Spacing.large,
    ...Shadow.medium,
  },
  
  actionButton: {
    marginVertical: Spacing.small,
  },
  
  // Info Section
  infoSection: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.large,
    marginTop: Spacing.large,
    borderRadius: Spacing.large,
    padding: Spacing.large,
    ...Shadow.medium,
  },
  
  infoText: {
    fontSize: Typography.sizes.regular,
    color: Colors.primaryText,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.regular,
    marginBottom: Spacing.medium,
    textAlign: 'justify',
  },
  
  // Logout Section
  logoutSection: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.large,
    marginTop: Spacing.large,
    borderRadius: Spacing.large,
    padding: Spacing.large,
    ...Shadow.medium,
    alignItems: 'center',
  },
  
  logoutNote: {
    fontSize: Typography.sizes.small,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: Spacing.medium,
    fontStyle: 'italic',
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xlarge,
    paddingHorizontal: Spacing.large,
  },
  
  footerText: {
    fontSize: Typography.sizes.medium,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
    marginBottom: Spacing.tiny,
  },
  
  footerSubText: {
    fontSize: Typography.sizes.small,
    color: Colors.secondaryText,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
