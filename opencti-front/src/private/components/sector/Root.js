import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Route, Redirect, withRouter } from 'react-router-dom';
import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from '../../../relay/environment';
import TopBar from '../nav/TopBar';
import Sector from './Sector';
import SectorReports from './SectorReports';
import SectorKnowledge from './SectorKnowledge';

const sectorQuery = graphql`
    query RootSectorQuery($id: String!) {
        sector(id: $id) {
            ...Sector_sector
            ...SectorHeader_sector
            ...SectorOverview_sector
            ...SectorReports_sector
            ...SectorKnowledge_sector
        }
    }
`;

class RootSector extends Component {
  render() {
    const { me, match: { params: { sectorId } } } = this.props;
    return (
      <div>
        <TopBar me={me || null}/>
        <QueryRenderer
          query={sectorQuery}
          variables={{ id: sectorId }}
          render={({ props }) => {
            if (props && props.sector) {
              return (
                <div>
                  <Route exact path='/dashboard/knowledge/sectors/:sectorId' render={
                    routeProps => <Sector {...routeProps} sector={props.sector}/>
                  }/>
                  <Route exact path='/dashboard/knowledge/sectors/:sectorId/reports' render={
                    routeProps => <SectorReports {...routeProps} sector={props.sector}/>
                  }/>
                  <Route exact path='/dashboard/knowledge/sectors/:sectorId/knowledge' render={
                    () => (<Redirect to={`/dashboard/knowledge/sectors/${sectorId}/knowledge/overview`}/>)
                  }/>
                  <Route path='/dashboard/knowledge/sectors/:sectorId/knowledge' render={
                    routeProps => <SectorKnowledge {...routeProps} sector={props.sector}/>
                  }/>
                </div>
              );
            }
            return (
              <div> &nbsp; </div>
            );
          }}
        />
      </div>
    );
  }
}

RootSector.propTypes = {
  children: PropTypes.node,
  match: PropTypes.object,
  me: PropTypes.object,
};

export default withRouter(RootSector);