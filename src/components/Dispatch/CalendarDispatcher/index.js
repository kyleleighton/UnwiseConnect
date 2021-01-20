import React, { PureComponent } from 'react';
import events from './events';
import moment from 'moment';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import { fetchDispatchItems, fetchMembers } from '../../../helpers/cw';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/sass/styles.scss';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';
import { connect } from 'react-redux';

const DragAndDropCalendar = withDragAndDrop(Calendar);

class CalendarDispatcher extends PureComponent {
  state = {
    events: events,
    displayDragItemInCell: true,
    dispatchItems: '',
    members: []
  }

  handleDragStart = event => {
    this.setState({
      draggedEvent: event
    });
  }

  dragFromOutsideItem = () => {
    return this.state.draggedEvent;
  }

  onDropFromOutside = ({ start, end, allDay }) => {
    const { draggedEvent } = this.state;

    const event = {
      id: draggedEvent.id,
      title: draggedEvent.title,
      start,
      end,
      allDay: allDay,
    }

    this.setState({
      draggedEvent: null
    });

    this.moveEvent({ event, start, end });
  }

  moveEvent = ({
    event,
    start,
    end,
    isAllDay: droppedOnAllDaySlot
  }) => {
    const { events } = this.state;
    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id == event.id ?
        {
          ...existingEvent,
          start,
          end
        } :
        existingEvent
    })

    this.setState({
      events: nextEvents,
    })
  }

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id == event.id ?
        {
          ...existingEvent,
          start,
          end
        } :
        existingEvent
    })

    this.setState({
      events: nextEvents,
    })
  }

  newEvent(event) {
    let idList = this.state.events.map(a => a.id)
    let newId = Math.max(...idList) + 1
    let hour = {
      id: newId,
      title: 'New Event',
      allDay: event.slots.length == 1,
      start: event.start,
      end: event.end,
    }
    this.setState({
      events: this.state.events.concat([hour]),
    })
  }

  getMonday = (d) => {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    let value = new Date(d.setDate(diff));
    value.setHours(0, 0, 0);
    return value;
  };

  getMembers = () => {
    let members = [];

    this.props.tickets.flattened.map(ticket => {
      if (ticket.owner) {
        if (members.findIndex(member => member.id === ticket.owner.id) === -1) {
          members.push({
            id: ticket.owner.id,
            name: ticket.owner.identifier
          });
        }
      }
    });

    members.map(member => {
      this.getScheduleEntries(member);
    })

    return members;
  }

  getScheduleEntries = async (member) => {
    let startDate = this.getMonday(moment().toDate())
    let endDate = new Date(startDate);

    endDate.setDate(startDate.getDate() + 4);
    endDate.setHours(23, 59, 59);
    startDate = startDate.toUTCString();
    endDate = endDate.toUTCString();
    fetchDispatchItems(member.id, startDate, endDate).then(res => {
      this.setState({
        members: {
          ...this.state.members,
          [member.id]: {
            name: member.name,
            tickets: res.name
          }
        }
      });
    }).catch(e => {
      console.log(e)
    })
  };

  render() {
    const localizer = momentLocalizer(moment);

    return (
      <>
        <button type="button" onClick={() => this.getMembers()}>Get Members</button>
        <DragAndDropCalendar
          selectable
          localizer = {localizer}
          events={this.state.events}
          onEventDrop={this.moveEvent}
          onEventResize={this.resizeEvent}
          onSelectSlot={this.newEvent}
          onDragStart={console.log}
          defaultView={Views.WEEK}
          defaultDate={new Date(Date.now())}
          popup={true}
          dragFromOutsideItem={this.state.displayDragItemInCell ? this.dragFromOutsideItem : null}
          onDropFromOutside={this.onDropFromOutside}
          handleDragStart={this.handleDragStart}
        />
      </>
    )
  }
}


const mapStateToProps = state => ({
  tickets: state.tickets,
});

export default connect(mapStateToProps)(CalendarDispatcher);
