import React, { PureComponent } from 'react';
import { fetchTicketById, updateTicketDetails } from '../../../helpers/cw';
import TicketForm from './EditForm';
import { getPhases } from '../helpers';

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
  }

  getTicketDetails = () => {
    fetchTicketById(this.state.ticketId || 418151).then(res => {
      const phases = getPhases(res, this.props.tickets)

      this.setState({
        budget: res.budgetHours,
        description: res.description,
        fullName: res.company.name + ' - ' + res.project.name,
        phaseValue: res.phase.name,
        summary: res.summary,
        ticketDetails: res,
        phases
      });
    });
  }

  updateTicketDetails = () => {
    updateTicketDetails({
      ticketId: this.state.ticketId,
      budget: this.state.budget,
      description: this.state.description,
      phaseValue: this.state.phaseValue,
      summary: this.state.summary,
      phaseId: this.state.phases.filter(phase => phase.path === this.state.phaseValue && phase.id)
    })
  }

  setTicketId = ticketId => {
    this.setState({
      ticketId
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
          updateTicketDetails={this.updateTicketDetails}
          fullName={this.state.fullName}
        />
      </div>
    )
  }
}


export default EditTicketForm;
