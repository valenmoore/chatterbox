import Head from "./Head/Head";
import Torso from "./Torso/Torso";

const Avatar = ({ props }) => {
    return (
        <div className="avatar-wrapper">
            {/*<svg id="avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 103 117.67">
                <Head props={props} />
            </svg>*/}
            <Head />
            <Torso />
            {/*<div className="head"></div>
            <div className="neck"></div>
            <div className="torso"></div>*/}
        </div>
    )
}

export default Avatar;