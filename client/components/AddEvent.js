import React, { Component } from "react";
import { connect } from "react-redux";
import TimePicker from "material-ui/TimePicker";
import { postEvent } from "../store";

class AddEvent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { handleSubmit, handleCancel, user, day } = this.props;

    return (
      <div className="space-around-buttons">
        <form onSubmit={evt => handleSubmit(user, evt, day)}>
          Name:<input className="input" name="name" />
          Location: <input className="input" name="location" />
          TimePicker:
          <div className="picker">
            <TimePicker format="ampm" hintText="HH:MM" name="time" />
          </div>
          <br />
          <button className="button is-success">
            <span>Submit</span>
          </button>
          <button
            className="button is-danger is-outlined"
            onClick={handleCancel}
          >
            <span>Cancel</span>
          </button>
        </form>
      </div>
    );
  }
}

const mapState = state => ({
  user: state.user,
  day: state.day
});

const mapDispatch = (dispatch, ownProps) => {
  return {
    handleSubmit(user, evt, day) {
      evt.preventDefault();

      const newEvent = {
        userId: user.id,
        name: evt.target.name.value,
        location: evt.target.location.value,
        time: evt.target.time.value,
        date: day
      };
      dispatch(postEvent(newEvent));
      ownProps.history.push("/day");
    },
    handleCancel() {
      ownProps.history.push("/day");
    }
  };
};

export default connect(mapState, mapDispatch)(AddEvent);
