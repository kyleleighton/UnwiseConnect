import React from 'react';
import TicketsDispatcher from './TicketsDispatcher';
import ToggleProjects from '../Tickets/ToggleProjects';

const Dispatch = () => {
  return (
    <div className="panel-uc panel panel-default">
      <div className="panel-uc__heading panel-heading clearfix">
        <h4>Dispatch Center</h4>
        <div className="dispatch-ticket-update">
          <ToggleProjects />
        </div>
      </div>
      <TicketsDispatcher />
    </div>
  )
}

export default Dispatch;
