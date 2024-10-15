import Eyes from "./Eyes/Eyes";
import Face from "./Face/Face";
import Hair from "./Hair/Hair";
import Mouth from "./Mouth/Mouth";
import Nose from "./Nose/Nose";

const Head = () => {
    return (
        <svg id="avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 103 117.67">
            <g className="head">
                <Face />
                <Hair />
                <Eyes />
                <Nose />
                <Mouth />
            </g>
        </svg>
    )
}

export default Head;