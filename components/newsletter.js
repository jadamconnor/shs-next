import { useState } from 'react'
import axios from 'axios'

export default function Newsletter() {
    const [email, setEmail] = useState("")
    const [state, setState] = useState("IDLE")
    const [errorMessage, setErrorMessage] = useState(null)

    const subscribe = async () => {
        setState("LOADING")
        setErrorMessage(null)

        try {
            const response = await axios.post("../api/newsletter", { email })
            setState("SUCCESS")
        } catch (e) {
            setErrorMessage(e.response.data.error)
            setState("ERROR")
        }
    }

    return (
        <div>
            <input
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
                type="button"
                disabled={state === "LOADING"}
                onClick={subscribe}
            >
                SUBMIT
            </button>
            {state === "ERROR" && (
                <p style={{color: "red"}}>{errorMessage}</p>
            )}
            {state === "SUCCESS" && (
                <p style={{color: "green"}}>Success!</p>
            )}
        </div>
    )
}