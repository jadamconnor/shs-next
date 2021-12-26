import axios from 'axios'

function getRequestParams(email) {
    // Get envars
    const API_KEY = process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY
    const LIST_ID = process.env.NEXT_PUBLIC_MAILCHIMP_LIST_ID
    // Just getting the datacenter from the end of the api key
    const DATACENTER = process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY.split("-")[1]

    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`

    // Additional params. More at https://mailchimp.com/developer/reference/lists/list-members
    const data = JSON.stringify({
        email_address: email,
        status: "subscribed"
    })
    
    // API key needs to be encoded in base64
    const base64ApiKey = Buffer.from(`anystring:${API_KEY}`).toString("base64")
    const headers = {
        "Content-type": "application/json",
        Authorization: `Basic ${base64ApiKey}`
    }

    return {
        url,
        data,
        headers
    }
}

export default async function handler(req, res) {
    const { email } = req.body

    if (!email || !email.length) {
        return res.status(400).json({
            error: "Forget to add email?"
        })
    }

    const { url, data, headers } = getRequestParams(email)

    axios.post(url, data, { headers })
    .then(() => {
        return res.status(201).json({ error: null })
    })
    .catch((error) => {
        return res.status(400).json({
            error: "Something went wrong. Email us at email@example.com, and we\'ll, add you to our mailing list."
        })
    })
}