// screens/IssuesScreen.js
// Government of Jharkhand Civic Issues Dashboard
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  ScrollView
} from 'react-native';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import StylishButton from '../components/StylishButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { Colors, Typography, Spacing, Layout, GovernmentBranding, Shadow } from '../constants/Theme';

export default function IssuesScreen() {
  const { t } = useLanguage();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // NEW: UI filter + selected modal state
  const [categoryFilter, setCategoryFilter] = useState('');      // filter textbox state
  const [selectedIssue, setSelectedIssue] = useState(null);      // modal state

  // Real-time listener — currently set to show only logged-in user's reports (you already did this).
  useEffect(() => {
    if (!auth.currentUser?.email) return;

    const q = query(
      collection(db, 'issues'),
      where('reportedBy', '==', auth.currentUser.email), // user-specific; change if you want "all"
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const issuesData = [];
      querySnapshot.forEach((doc) => {
        issuesData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        });
      });
      setIssues(issuesData);
      setLoading(false);
      setRefreshing(false);
    }, (error) => {
      console.error("Error fetching issues: ", error);
      setLoading(false);
      setRefreshing(false);
    });

    return unsubscribe;
  }, [auth.currentUser?.email]);

  const onRefresh = () => {
    setRefreshing(true);
    // onSnapshot will update automatically
  };

  // Render each issue card with government styling
  const renderIssue = ({ item }) => {
    const priorityInfo = getPriorityLevel(item.priority || 0);
    const statusColor = getStatusColor(item.status);
    
    return (
      <TouchableOpacity onPress={() => setSelectedIssue(item)} activeOpacity={0.8}>
        <View style={styles.issueCard}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.categoryBadge, { backgroundColor: Colors.primary }]}>
                <Text style={styles.categoryBadgeText}>
                  {t(`report.categories.${item.category || 'general'}`)}
                </Text>
              </View>
              {item.priority && (
                <View style={[styles.priorityBadge, { backgroundColor: priorityInfo.color }]}>
                  <Text style={styles.priorityBadgeText}>{t(`issues.priority.${priorityInfo.key}`)}</Text>
                </View>
              )}
            </View>
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
              <Text style={styles.statusIndicatorText}>
                {t(`issues.status.${(item.status || 'reported').toLowerCase().replace('-', '')}`)}
              </Text>
            </View>
          </View>

          {/* Image Section */}
          {item.imageUrl && (
            <View style={styles.cardImageContainer}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.overlayIcon}>📷</Text>
              </View>
            </View>
          )}

          {/* Content Section */}
          <View style={styles.cardContent}>
            <Text style={styles.cardDescription} numberOfLines={3}>
              {item.description}
            </Text>
            
            {/* Metrics */}
            <View style={styles.cardMetrics}>
              {item.impactScore && (
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>{t('issues.metrics.impact')}</Text>
                  <Text style={styles.metricValue}>{item.impactScore}/100</Text>
                </View>
              )}
              {item.location && (
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>{t('issues.metrics.location')}</Text>
                  <Text style={styles.metricValue}>
                    {item.location.latitude.toFixed(3)}, {item.location.longitude.toFixed(3)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Card Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.reporterInfo}>
              <Text style={styles.reporterIcon}>👤</Text>
              <Text style={styles.reporterName}>{item.reportedBy}</Text>
            </View>
            <Text style={styles.timestamp}>
              {item.createdAt.toLocaleDateString()} • {item.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </View>
          
          {/* Tap Indicator */}
          <View style={styles.tapIndicator}>
            <Text style={styles.tapText}>{t('issues.tapForDetails')}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <LoadingSpinner 
        text={t('issues.loading')}
        variant="government" 
        showBranding={true}
      />
    );
  }

  // Filtered data for FlatList with enhanced filtering
  const filteredIssues = issues.filter(issue =>
    categoryFilter.length === 0 ||
    (issue.category || '').toLowerCase().includes(categoryFilter.toLowerCase()) ||
    (issue.description || '').toLowerCase().includes(categoryFilter.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return Colors.success;
      case 'in-progress': return Colors.warning;
      case 'reported': return Colors.info;
      default: return Colors.secondary;
    }
  };

  const getPriorityLevel = (priority) => {
    if (priority >= 80) return { key: 'high', color: Colors.error };
    if (priority >= 50) return { key: 'medium', color: Colors.warning };
    return { key: 'low', color: Colors.success };
  };

  return (
    <View style={styles.container}>
      {/* Government Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.headerIcon}>🏛️</Text>
          <View style={styles.headerTextContainer}>
            <Text style={styles.governmentTitle}>{t('issues.headerTitle')}</Text>
            <Text style={styles.departmentText}>{t('issues.headerSubtitle')}</Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{issues.length}</Text>
            <Text style={styles.statLabel}>{t('issues.totalReports')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredIssues.length}</Text>
            <Text style={styles.statLabel}>{t('issues.filteredResults')}</Text>
          </View>
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>{t('issues.searchLabel')}</Text>
        <TextInput
          style={styles.filterInput}
          placeholder={t('issues.searchPlaceholder')}
          value={categoryFilter}
          onChangeText={setCategoryFilter}
          returnKeyType="search"
        />
      </View>

      {/* Issues List */}
      <FlatList
        data={filteredIssues}
        renderItem={renderIssue}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyTitle}>{t('issues.emptyTitle')}</Text>
            <Text style={styles.emptySubtitle}>
              {categoryFilter ? t('issues.emptySubtitle') : t('issues.emptyDefault')}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Enhanced Modal with Government Styling */}
      <Modal
        visible={!!selectedIssue}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedIssue(null)}
      >
        {selectedIssue && (
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
                <Text style={styles.modalTitle}>{t('issues.detailsTitle')}</Text>
                <Text style={styles.modalSubtitle}>{t('issues.headerTitle')}</Text>
              </View>
              <StylishButton
                title="✕"
                onPress={() => setSelectedIssue(null)}
                variant="outline"
                size="small"
                style={styles.closeButton}
              />
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Status and Category */}
              <View style={styles.modalStatusContainer}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedIssue.status) }]}>
                  <Text style={styles.statusText}>{t(`issues.status.${(selectedIssue.status || 'reported').toLowerCase().replace('-', '')}`)}</Text>
                </View>
                <View style={[styles.categoryBadge]}>
                  <Text style={styles.categoryText}>{t(`report.categories.${selectedIssue.category || 'general'}`)}</Text>
                </View>
              </View>

              {/* Image */}
              {selectedIssue.imageUrl && (
                <View style={styles.modalImageContainer}>
                  <Image
                    source={{ uri: selectedIssue.imageUrl }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                </View>
              )}

              {/* Description */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>{t('issues.modal.description')}</Text>
                <Text style={styles.descriptionText}>{selectedIssue.description}</Text>
              </View>

              {/* Details Grid */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{t('issues.modal.reported')}</Text>
                  <Text style={styles.detailValue}>
                    {selectedIssue.createdAt.toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{t('issues.metrics.location')}</Text>
                  <Text style={styles.detailValue}>
                    {selectedIssue.location ? 
                      `${selectedIssue.location.latitude.toFixed(4)}, ${selectedIssue.location.longitude.toFixed(4)}` : 
                      t('issues.modal.notAvailable')
                    }
                  </Text>
                </View>
                
                {selectedIssue.priority && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t('issues.modal.priority')}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityLevel(selectedIssue.priority).color }]}>
                      <Text style={styles.priorityText}>{t(`issues.priority.${getPriorityLevel(selectedIssue.priority).key}`)}</Text>
                    </View>
                  </View>
                )}
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{t('issues.modal.impactScore')}</Text>
                  <Text style={styles.detailValue}>
                    {selectedIssue.impactScore || 'N/A'}/100
                  </Text>
                </View>
              </View>

              {/* Reporter Info */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>{t('issues.modal.reportedBy')}</Text>
                <Text style={styles.reporterText}>{selectedIssue.reportedBy}</Text>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
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
  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white + '20',
    borderRadius: Spacing.medium,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statNumber: {
    fontSize: Typography.sizes.xxlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.lightText,
  },
  
  statLabel: {
    fontSize: Typography.sizes.small,
    color: Colors.lightText,
    opacity: 0.8,
    marginTop: 2,
  },
  
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.lightText,
    opacity: 0.3,
    marginHorizontal: Spacing.large,
  },
  
  // Filter Section
  filterSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  
  filterLabel: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
    marginBottom: Spacing.small,
  },
  
  filterInput: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    backgroundColor: Colors.documentBg,
    fontSize: Typography.sizes.regular,
    color: Colors.primaryText,
  },
  
  // List Container
  listContainer: {
    paddingBottom: Spacing.xlarge,
  },
  
  // Issue Card Styling
  issueCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.medium,
    marginVertical: Spacing.small,
    borderRadius: Spacing.large,
    ...Shadow.heavy,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    overflow: 'hidden',
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  categoryBadge: {
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.tiny,
    borderRadius: Spacing.medium,
    marginRight: Spacing.small,
  },
  
  categoryBadgeText: {
    color: Colors.lightText,
    fontSize: Typography.sizes.tiny,
    fontWeight: Typography.weights.bold,
  },
  
  priorityBadge: {
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.tiny,
    borderRadius: Spacing.medium,
  },
  
  priorityBadgeText: {
    color: Colors.lightText,
    fontSize: Typography.sizes.tiny,
    fontWeight: Typography.weights.bold,
  },
  
  statusIndicator: {
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.tiny,
    borderRadius: Spacing.medium,
  },
  
  statusIndicatorText: {
    color: Colors.lightText,
    fontSize: Typography.sizes.tiny,
    fontWeight: Typography.weights.bold,
  },
  
  // Image Section
  cardImageContainer: {
    position: 'relative',
  },
  
  cardImage: {
    width: '100%',
    height: 150,
  },
  
  imageOverlay: {
    position: 'absolute',
    top: Spacing.small,
    right: Spacing.small,
    backgroundColor: Colors.black + '60',
    borderRadius: Spacing.large,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.tiny,
  },
  
  overlayIcon: {
    fontSize: Typography.sizes.medium,
  },
  
  // Content Section
  cardContent: {
    padding: Spacing.medium,
  },
  
  cardDescription: {
    fontSize: Typography.sizes.regular,
    color: Colors.primaryText,
    lineHeight: Typography.lineHeights.normal * Typography.sizes.regular,
    marginBottom: Spacing.small,
  },
  
  cardMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  
  metricLabel: {
    fontSize: Typography.sizes.small,
    color: Colors.secondaryText,
    marginBottom: 2,
  },
  
  metricValue: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  
  // Footer Section
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.medium,
    paddingBottom: Spacing.medium,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: Spacing.small,
  },
  
  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  reporterIcon: {
    fontSize: Typography.sizes.small,
    marginRight: Spacing.tiny,
  },
  
  reporterName: {
    fontSize: Typography.sizes.small,
    color: Colors.secondaryText,
    fontWeight: Typography.weights.medium,
  },
  
  timestamp: {
    fontSize: Typography.sizes.tiny,
    color: Colors.secondaryText,
  },
  
  tapIndicator: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.tiny,
    alignItems: 'center',
  },
  
  tapText: {
    color: Colors.lightText,
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.medium,
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.massive,
  },
  
  emptyIcon: {
    fontSize: Typography.sizes.massive * 2,
    marginBottom: Spacing.medium,
  },
  
  emptyTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryText,
    marginBottom: Spacing.small,
  },
  
  emptySubtitle: {
    fontSize: Typography.sizes.regular,
    color: Colors.secondaryText,
    textAlign: 'center',
    paddingHorizontal: Spacing.xlarge,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.regular,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  modalHeader: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: Spacing.large,
    paddingHorizontal: Spacing.large,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadow.government,
  },
  
  modalHeaderContent: {
    flex: 1,
  },
  
  modalTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.lightText,
  },
  
  modalSubtitle: {
    fontSize: Typography.sizes.medium,
    color: Colors.lightText,
    opacity: 0.9,
    marginTop: 2,
  },
  
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: Spacing.medium,
  },
  
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.large,
  },
  
  modalStatusContainer: {
    flexDirection: 'row',
    paddingVertical: Spacing.large,
    justifyContent: 'center',
  },
  
  statusBadge: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: Spacing.large,
    marginRight: Spacing.medium,
  },
  
  statusText: {
    color: Colors.lightText,
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
  
  categoryBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: Spacing.large,
  },
  
  categoryText: {
    color: Colors.lightText,
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
  
  modalImageContainer: {
    marginVertical: Spacing.large,
  },
  
  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: Spacing.medium,
  },
  
  modalSection: {
    marginVertical: Spacing.large,
  },
  
  sectionTitle: {
    ...GovernmentBranding.sectionHeader,
    fontSize: Typography.sizes.large,
    marginBottom: Spacing.small,
  },
  
  descriptionText: {
    fontSize: Typography.sizes.regular,
    color: Colors.primaryText,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.regular,
  },
  
  detailsGrid: {
    marginVertical: Spacing.large,
  },
  
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  
  detailLabel: {
    fontSize: Typography.sizes.medium,
    color: Colors.secondaryText,
    fontWeight: Typography.weights.medium,
  },
  
  detailValue: {
    fontSize: Typography.sizes.medium,
    color: Colors.primaryText,
    fontWeight: Typography.weights.semibold,
  },
  
  priorityBadge: {
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.tiny,
    borderRadius: Spacing.medium,
  },
  
  priorityText: {
    color: Colors.lightText,
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.bold,
  },
  
  reporterText: {
    fontSize: Typography.sizes.regular,
    color: Colors.primaryText,
    fontWeight: Typography.weights.medium,
  },
});
