import React, { useState, useEffect } from 'react';
import TicketsDispatcher from './TicketsDispatcher';
import ToggleProjects from '../Tickets/ToggleProjects';
import CalendarDispatcher from './CalendarDispatcher';

const Dispatch = () => {
  const [activeTab, setActiveTab] = useState('calendar'); // for dev; will be tickets by default when the feature is done

  return (
    <div className="panel-uc panel panel-default">
      <div className="panel-uc__heading panel-heading clearfix">
        <h4>Dispatch Center</h4>
        <div className="dispatch-ticket-update">
          <ToggleProjects />
        </div>
      </div>
      <div className="dispatch-tabs">
        <button className="btn btn-default" type="button" onClick={() => setActiveTab('tickets')}>Tickets</button>
        <button className="btn btn-default" type="button" onClick={() => setActiveTab('calendar')}>Calendar</button>
      </div>
      {activeTab === 'tickets' ? (
        <TicketsDispatcher />
      ) : (
        <CalendarDispatcher />
      )}
    </div>
  )
}

export default Dispatch;
