import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import BootstrapTable from 'react-bootstrap-table-next';

class SearchColumns extends React.Component {
  componentDidUpdate = (prevProps) => {
    if (prevProps.columns !== this.props.columns) {
      this.compileColumns();
    }
  }

  compileColumns = () => {
    let columns = [];
    this.props.columns.map(column => {
      columns.push({
        dataField: column.property,
        text: column.header.label,
        sort: true,
        sortCaret: (order, column) => {
          if (!order || order === 'asc') return (<span className="sorting-arrow">Up</span>);
          else if (order === 'desc') return (<span className="sorting-arrow down-arrow">Down</span>);
          return null;
        },
      })
    });
    return columns;
  }

  render() {
    return (
      <React.Fragment>
        <BootstrapTable keyField='id' data={ this.compileColumns() } columns={ this.compileColumns() } />
        <tr>
          {this.props.columns.map((column, i) => (
            <th key={`${column.property || i}-column-filter`} className="column-filter">
              {column && column.property ?
                this.renderFilter(column)
              : ''}
            </th>
          ))}
        </tr>
      </React.Fragment>
    );
  }

  renderFilter(column) {
    if (column.filterType === 'dropdown') {
      return this.renderDropdownFilter(column);
    } else if (column.filterType === 'none') {
      return '';
    } else if (column.filterType === 'custom') {
      return typeof column.customFilter === 'function' ? column.customFilter() : column.customFilter;
    }
    return this.renderTextFilter(column);
  }

  renderTextFilter(column) {
    const onQueryChange = (event) => {
      this.props.onChange({
        ...this.props.query,
        [event.target.name]: event.target.value,
      });
    };

    return (
      <input
        autoComplete="off"
        onChange={onQueryChange}
        className="column-filter-input"
        name={column.property}
        placeholder={column.filterPlaceholder || ''}
        value={this.props.query[column.property] || ''}
      />
    );
  }

  renderDropdownFilter(column) {
    const onQueryChange = (values) => {
      // Flatten subarrays.
      const flatValues = values.map(option => option.value).reduce((acc, val) => acc.concat(Array.isArray(val) ? val : [val]), []);
      this.props.onChange({
        ...this.props.query,
        [column.property]: flatValues.length ? [ ...new Set(flatValues) ] : '',
      });
    };

    const rowValues = this.props.rows.map(row => row[column.property]);
    const uniqueRowValues = [ ...new Set(rowValues) ];
    const extraOptions = (column.extraOptions || []).map(this.evaluateExtraOption.bind(this, column, uniqueRowValues));
    const options = extraOptions.filter(opt => opt).concat(uniqueRowValues.map(value => ({ value, label: value })));
    const query = this.props.query[column.property];
    const value = query ? query.map(value => ({ value, label: value })) : [];

    return (
      <div className="column-filter-dropdown">
        <Select
          isMulti={true}
          name={column.property}
          value={value}
          onChange={onQueryChange}
          options={options}
        />
      </div>
    );
  }

  evaluateExtraOption(column, uniqueRowValues, option) {
    if (typeof option === 'function') {
      const currentValue = this.props.query[column.property] || [];
      return option(column, uniqueRowValues, currentValue);
    }
    return option;
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
