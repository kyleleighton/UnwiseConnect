import sortBy from 'sort-by';

export const getPhases = (ticketDetails, tickets) => {
  let phases = [];

  tickets.map(ticket => {
    if (ticketDetails.project.name === ticket.project.name && ticketDetails.company.name === ticket.company.name) {
      phases.push({
        path: ticket.phase.path,
        id: ticket.phase.id,
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
  return sortedDeduplicatedPhases;
}
