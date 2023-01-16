import Profile from './Profile';
import Feed from './Feed';
import Nft from './Nft';
import { Switch, Route } from 'react-router-dom';
import { useSidebar } from './slices/sidebarSlice';

const View = () => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div
      className='container-fluid position-relative bg-view-dark px-4 px-sm-5 view-container'
      style={{
        top: 84,
        left: 80,
        width: 'calc(100% - 80px)',
        marginLeft: isSidebarOpen ? 240 : 0,
        paddingBottom: 1,
      }}
    >
      <Switch>
        <Route path='/profile'>
          <Profile />
        </Route>
        <Route path='/nft'>
          <Nft />
        </Route>
        <Route path='/'>
          <Feed />
        </Route>
      </Switch>
    </div>
  );
};

export default View;
