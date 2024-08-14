const ResponseFeedback = ({ feedback }) => {
    const segments = feedback
        .replace(/\*\*/g, '<b>')
        .split(/<b>|<\/b>/);

    // Map over the segments and apply formatting
    const styledFeedback = segments.map((segment, index) => {
        // Check if the segment is a line break
        if (segment === 'br/') {
            return <br key={index} />;
        }
        // Apply bold formatting for segments wrapped in <b> tags
        else if (index % 2 === 1) {
            return <b key={index}>{segment}</b>;
        } else {
            return segment;
        }
    });


    return (
        <div className="response-feedback">
            <h3>Response Feedback</h3>
            <div>{styledFeedback}</div>
        </div>
    );
};

export default ResponseFeedback;