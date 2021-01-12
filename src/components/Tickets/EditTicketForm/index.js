import * as TicketsActions from '../../../actions/tickets';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fetchTicketById, updateTicketDetails } from '../../../helpers/cw';
import TicketForm from './EditForm';
import sortBy from 'sort-by';

class EditTicketForm extends PureComponent {
  state = {
    budget: '',
    description: '',
    fullName: '',
    hasCompletedTicket: false,
    phases: [],
    phaseValue: '',
    summary: '',
    ticketDetails: '',
    ticketId: '',
    ticketType: 'project',
  }

  getTicketDetails = () => {
    fetchTicketById(this.state.ticketId || 418151).then(res => {
      this.setState({
        budget: res.budgetHours,
        description: res.description,
        fullName: res.company.name + ' - ' + res.project.name,
        phaseValue: res.phase.name,
        summary: res.summary,
        ticketDetails: res,
      }, this.getPhases);
    })
  }

  updateTicketDetails = () => {
    updateTicketDetails({
      ticketId: 418151,
      budget: this.state.budget,
      description: this.state.description,
      // fullName: this.state.company.name + ' - ' + this.state.project.name,
      // phaseValue: this.state.phase.name,
      summary: this.state.summary,
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
        phases.push({ path: ticket.phase.path });
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


  setDescription = description => {
    this.setState({ description });
  }

  setPhaseValue = phaseValue => {
    this.setState({
      phaseValue,
      selectedPhase: this.state.phases.filter(phase => phase.path === phaseValue),
    })
  }
  
  setSummary = summary => {
    this.setState({ summary });
  }

  setBudget = budget => {
    this.setState({ budget });
  }

  setTicketCompleted = hasCompletedTicket => {
    this.setState({ hasCompletedTicket });
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.getTicketDetails}>Edit Ticket</button>
        <button type="button" onClick={this.updateTicketDetails}>Finish</button>

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
          budget={this.state.budget}
          description={this.state.description}
          hasCompletedTicket={this.state.hasCompletedTicket}
          phaseValue={this.state.phaseValue}
          selectedPhase={this.state.selectedPhase}
          selectedProject={this.props.selectedProject}
          setBudget={this.setBudget}
          setDescription={this.setDescription}
          setPhaseValue={this.setPhaseValue}
          setSummary={this.setSummary}
          setTicketCompleted={this.setTicketCompleted}
          summary={this.state.summary}
          ticketType={this.state.ticketType}
          fullName={this.state.fullName}
        />
      </div>
    )
  }
}


export default EditTicketForm;
