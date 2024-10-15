import Autocomplete from "../../Autocomplete/Autocomplete";
import { languageMap } from "../../../constants/constants";
import { createSave } from "../../../utils/chatFunctions";
import { useState } from "react";
import { doc } from "firebase/firestore";
import useFirebaseAuth from "../../../hooks/useAuth";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";

const NewSave = () => {
    const [selectedLang, setSelectedLang] = useState(null);
    const userProfile = useFirebaseAuth();
    const navigate = useNavigate();

    const getLangKey = full => {
        for (const key of Object.keys(languageMap)) {
            if (languageMap[key].full === full) return key;
        }
        return null;
    }

    const handleNewSave = async () => {
        if (selectedLang !== null && !userProfile.isLoading) {
            try {
                const docRef = doc(db, "users", userProfile.user?.uid);
                const index = await createSave(docRef, getLangKey(selectedLang));
                navigate("/saves/" + index);
            } catch (error) {
                console.log("error creating save", error);
            }
        }
    }

    const handleSelect = selected => {
        setSelectedLang(selected);
    }

    return (
        <div className="save-window">
            <div className="top-row">
                <button onClick={() => navigate("/dashboard")}>Go Back</button>
                <div>Select a language: </div>
                <button onClick={handleNewSave}>Create</button>
            </div>
            <Autocomplete suggestions={Object.values(languageMap).map(m => m.full)} onSelect={handleSelect} />
        </div>
    )
}

export default NewSave;