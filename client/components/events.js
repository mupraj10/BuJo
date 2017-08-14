import React from 'react';

const Events = (props) => {
    const { events } = props;
    return (
        <div>
            <h3 className="singleName-headings">Events</h3>
            {events.map((event, idx) => (
                <div key={idx}>
                    <span> &#x25CB;</span>
                    <span> {event.time} {event.name} </span>
                </div>
            ))}
        </div>
    )
}

export default Events;

//add in button for location to do maps thing
