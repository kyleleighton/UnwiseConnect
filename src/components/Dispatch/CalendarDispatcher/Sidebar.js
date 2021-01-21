import React, { PureComponent } from 'react';

class Sidebar extends PureComponent {
  render() {
    return (
      <div>
        <form>
          <label htmlFor="member">Member</label>
          <select>
            {this.props.memberNames.map(member => (
              <option>{member}</option>
            ))}
          </select>
        </form>
      </div>
    )
  }
}

export default Sidebar;
