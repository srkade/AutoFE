// Navigation Component with Integrated Search
import React from 'react';
import NavigationTabs from '../panels/NavigationTabs';
import GlobalSearch from './GlobalSearch';
import { useGlobalSearch } from '../hooks/useGlobalSearch';

interface NavigationWithSearchProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  hideLogout?: boolean;
  hideLogo?: boolean;
}

const NavigationWithSearch: React.FC<NavigationWithSearchProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  user,
  hideLogout = false,
  hideLogo = false
}) => {
  const { isSearchOpen, closeSearch } = useGlobalSearch();

  return (
    <>
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        onLogout={onLogout}
        user={user}
        hideLogout={hideLogout}
        hideLogo={hideLogo}
      />
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={closeSearch}
        onItemSelected={(item) => {
          // Add navigation logic based on item type
        }}
      />
    </>
  );
};

export default NavigationWithSearch;