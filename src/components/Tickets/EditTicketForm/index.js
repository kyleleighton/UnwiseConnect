import * as TicketsActions from '../../../actions/tickets';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fetchTicketById } from '../../../helpers/cw';

class EditTicketForm extends PureComponent {
  state = {
    ticketDetails: '',
    ticketId: ''
  }

  getTicketDetails = () => {
    fetchTicketById(403812 || this.state.ticketId).then(res => {
      this.setState({
        ticketDetails: res
      });
    })
  }

  setTicketId = ticketId => {
    this.setState({
      ticketId
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
        <EditTicketForm
          ticketDetails={this.state.ticketDetails}
          ticketId={this.state.ticketId}
        />
      </div>
    )
  }
}


export default EditTicketForm;
