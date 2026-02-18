import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { shared } from './styles/shared.js';
import TabBar from './components/TabBar.jsx';
import CrewSwitcher from './components/CrewSwitcher.jsx';
import TripDetail from './components/TripDetail.jsx';
import BookPreview from './components/BookPreview.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import PlanScreen from './screens/PlanScreen.jsx';
import LiveScreen from './screens/LiveScreen.jsx';
import MemoriesScreen from './screens/MemoriesScreen.jsx';
import CrewScreen from './screens/CrewScreen.jsx';
import AwardsScreen from './screens/AwardsScreen.jsx';
import GamesScreen from './screens/GamesScreen.jsx';

const AppShell = () => {
  const { activeTab, showCrewSwitcher, selectedTrip, showBookPreview } = useApp();

  return (
    <div style={shared.app}>
      <div style={shared.statusBar} />
      <div style={shared.content}>
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'plan' && <PlanScreen />}
        {activeTab === 'live' && <LiveScreen />}
        {activeTab === 'memories' && <MemoriesScreen />}
        {activeTab === 'crew' && <CrewScreen />}
        {activeTab === 'awards' && <AwardsScreen />}
        {activeTab === 'games' && <GamesScreen />}
      </div>
      <TabBar />

      {/* Modals */}
      {showCrewSwitcher && <CrewSwitcher />}
      {selectedTrip && <TripDetail trip={selectedTrip} />}
      {showBookPreview && <BookPreview />}
    </div>
  );
};

const App = () => (
  <AppProvider>
    <AppShell />
  </AppProvider>
);

export default App;
