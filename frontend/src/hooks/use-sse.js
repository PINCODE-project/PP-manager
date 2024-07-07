import { useEffect, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import API from "../api/API";


const useSse = (event, isLoading) => {
    const [ message, setMessage ] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const fetchData = async () => {
            await fetchEventSource(`${API.SSE}/${event}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("PP-manager-accessToken")}`,
                },
                onmessage(event) {
                    try {
                        const parsedData = event.data;
                        setMessage(parsedData);
                    } catch(error) {
                        console.error('useSse parsing error');
                    }
                },
                signal,
            });
        };

        if(isLoading)
            fetchData();

        return () => controller.abort();
    }, [ event, isLoading ]);

    return message;
};

export default useSse;
