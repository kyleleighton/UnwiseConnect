import React, { PureComponent } from 'react';
import events from './events';
import moment from 'moment';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/sass/styles.scss';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';

const DragAndDropCalendar = withDragAndDrop(Calendar);

class CalendarDispatcher extends PureComponent {
  state = {
    events: events,
    displayDragItemInCell: true,
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
    // let idList = this.state.events.map(a => a.id)
    // let newId = Math.max(...idList) + 1
    // let hour = {
    //   id: newId,
    //   title: 'New Event',
    //   allDay: event.slots.length == 1,
    //   start: event.start,
    //   end: event.end,
    // }
    // this.setState({
    //   events: this.state.events.concat([hour]),
    // })
  }

  render() {
    const localizer = momentLocalizer(moment);

    return (
      <DragAndDropCalendar
        selectable
        localizer = {localizer}
        events={this.state.events}
        onEventDrop={this.moveEvent}
        resizableoEventResize = {this.resizeEvent}
        onSelectSlot={this.newEvent}
        onDragStart={console.log}
        defaultView={Views.WEEK}
        defaultDate={new Date(Date.now())}
        popup={true}
        dragFromOutsideItem={this.state.displayDragItemInCell ? this.dragFromOutsideItem : null}
        onDropFromOutside={this.onDropFromOutside}
        handleDragStart={this.handleDragStart}
      />
    )
  }
}

export default CalendarDispatcher;
