import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

class SearchColumns extends React.Component {
  state = {
    columns: [],
    rows: []
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.columns !== this.props.columns) {
      this.compileColumns();
    }
  }

  evaluateExtraOption(column, uniqueRowValues, option) {
    if (typeof option === 'function') {
      const currentValue = this.props.query[column.property] || [];
      return option(column, uniqueRowValues, currentValue);
    }
    return option;
  }

  compileColumns = () => {
    let columns = [];

    this.props.columns.map(column => {
      const extraOptions = (column.extraOptions || []).map(this.evaluateExtraOption.bind(this, column, this.props.rows));
      const statusOptions = extraOptions.filter(option => option.label == 'All Complete');
      const options = (statusOptions[0] && statusOptions[0].value) || [];
      let dropdownOptions = [];

      const defaultColumnData = {
        dataField: column.property,
        text: column.header.label,
        sort: true,
        editable: false
      }

      options.map(option => {
        dropdownOptions.push({
          value: option,
          label: option,
        })
      })

      if (column.filterType === 'dropdown') {
        columns.push({
          ...defaultColumnData,
          filter: selectFilter({ options: { ...options } }),
          editable: true,
          editor: {
            type: Type.SELECT,
            options: [...dropdownOptions]
          }
        })
      } else if (column.filterType == 'none'){
        columns.push({
          dataField: column.property,
          text: column.header.label,
        })
      } else {
        columns.push({
          ...defaultColumnData,
          filter: textFilter()
        })        
      }
    });
    this.setState({
      columns
    });
    this.compileRows();
    return columns;
  }

  compileRows = () => {
    const rows = this.props.rows.map(row => {
      return {
        'mobileGuid': row.mobileGuid,
        'phase.path': row.phase.path,
        'company.name': row['company.name'],
        'project.name': row['project.name'],
        'actualHours': row.actualHours,
        'billTime': row.billTime,
        'resources': row.resources,
        'id': row.id,
        'summary': row.summary,
        'impact': row.impact,
        'budgetHours': row.budgetHours || '',
        'actualHours': row.actualHours || '',
        'status.name': row['status.name'],
        'customFields': row.customFields
      }
    })
    const uniqueRowValues = [ ...new Set(rows) ];
    this.setState({
      rows: uniqueRowValues
    });
  }

  render() {
    const paginationOption = {
      custom: true,
      sizePerPage: this.props.ticketCount,
    };
    return (
      <React.Fragment>
        {this.state.columns.length > 0 && (
          <PaginationProvider
            pagination={ paginationFactory(paginationOption) }
          >
            {
              ({
                paginationProps,
                paginationTableProps
              }) => (
                <BootstrapTable cellEdit={ cellEditFactory({ mode: 'click' }) } { ...paginationTableProps } pagination={ paginationFactory()} filter={ filterFactory()} classes="table table-striped table-bordered" keyField='id' data={ this.state.rows } columns={ this.state.columns } />
              ) 
            }
          </PaginationProvider>
        )}
      </React.Fragment>
    );
  }
}

SearchColumns.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  query: PropTypes.object,
  rows: PropTypes.arrayOf(PropTypes.object),
};
SearchColumns.defaultProps = {
  query: {},
};

export default SearchColumns;
