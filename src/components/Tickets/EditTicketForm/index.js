import * as TicketsActions from '../../../actions/tickets';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fetchTicketById } from '../../../helpers/cw';
import TicketForm from './EditForm';
import sortBy from 'sort-by';

class EditTicketForm extends PureComponent {
  state = {
    ticketDetails: '',
    ticketId: '',
    phases: []
  }

  getTicketDetails = () => {
    fetchTicketById(403812 || this.state.ticketId).then(res => {
      this.setState({
        ticketDetails: res
      }, this.getPhases);
    })
  }

  setTicketId = ticketId => {
    this.setState({
      ticketId
    });
  }

  getPhases = () => {
    let phases = [];
    const { ticketDetails } = this.state;

    this.props.tickets.map(ticket => {
      if (ticketDetails.project.name === ticket.project.name && ticketDetails.company.name === ticket.company.name) {
        phases.push({
          path: ticket.phase.path,
          phaseId: ticket.phase.id,
          ticketId: ticket.id
        });
      }
    });

    const deduplicatedPhases = phases.reduce((uniquePhases, currentPhase) => {
      if (!uniquePhases.some(phase => phase.path === currentPhase.path)) {
        uniquePhases.push(currentPhase);
      }
      return uniquePhases;
    }, []);

    const sortedDeduplicatedPhases = deduplicatedPhases.sort(sortBy('path'));

    this.setState({
      phases: sortedDeduplicatedPhases
    });
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.getTicketDetails}>Edit Ticket</button>
        <label htmlFor="ticket-number">Ticket Number</label>
        <input
          type="number"
          id="ticket-number"
          className="form-control"
          onChange={(e) => this.setTicketId(e.target.value)}
          min="6"
          value={this.state.ticketId}
        ></input>
        <TicketForm
          ticketDetails={this.state.ticketDetails}
          ticketId={this.state.ticketId}
          phases={this.state.phases}
        />
      </div>
    )
  }
}


export default EditTicketForm;
