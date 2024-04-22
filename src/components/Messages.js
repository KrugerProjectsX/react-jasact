import { useEffect, useRef, useState } from "react";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Box, Button, TextField } from "@mui/material";

export default function Messages({ flatId }) {
    const ref = doc(db, "flats", flatId);
    const refMessages = collection(db, "messages");

    const [flat, setFlat] = useState({});
    const [type, setType] = useState('create');
    const [messages, setMessages] = useState([]);
    const messageInput = useRef('');
    const [messageSent, setMessageSent] = useState(false);

    const getMessages = async () => {
        const search = query(refMessages, where("flatId", "==", flatId));
        const dataMessages = await getDocs(search);
        const rows = dataMessages.docs.map(async (item) => {
            const messageData = item.data();
            const userData = await getDoc(doc(db, "users", messageData.userId));
            const userName = userData.exists() ? `${userData.data().firstName} ${userData.data().lastName}` : "Unknown"; // Construir el nombre completo del usuario
            return { ...messageData, id: item.id, userName: userName };
        });
        const resolvedRows = await Promise.all(rows); // Esperar a que todas las promesas se resuelvan
        setMessages(resolvedRows);
    }

    const getFlat = async () => {
        const userId = JSON.parse(localStorage.getItem('user_logged'));
        const dataFlat = await getDoc(ref);
        const responseFlat = { ...dataFlat.data() };
        if (responseFlat.user === userId) {
            setType('view');
            await getMessages();
        } else {
            setType('create');
        }
        setFlat(responseFlat);
    }

    useEffect(() => {
        getFlat();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const message = messageInput.current.value;
        const data = {
            message: message,
            flatId: flatId,
            userId: JSON.parse(localStorage.getItem('user_logged')),
            timestamp: new Date().toLocaleString() // Agregar la hora actual al mensaje
        }
        await addDoc(refMessages, data);
        setMessageSent(true);
        setTimeout(() => {
            setMessageSent(false);
        }, 3000); // Después de 3 segundos, ocultar el mensaje de enviado correctamente
    }

    return (
        <div>
            <h1>Messages</h1>
            {type === 'create' &&
                <>
                    <Box
                        component={'form'}
                        onSubmit={handleSubmit}
                        className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-200 shadow-md"
                    >
                        <TextField type={'text'} label={'Message'} inputRef={messageInput} multiline maxRows={10} minRows={10} className="mb-4" />
                        <Button type={'submit'} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send</Button>
                        {messageSent && <p className="text-green-500 mt-2">Message sent successfully!</p>}
                    </Box>
                </>
            }
            {type === 'view' &&
                <>
                    {messages.map((item) => {
                        return (
                            <div key={item.id} className="border p-4 m-4 rounded-full bg-blue-100">
                                <p className="text-center">{item.message}</p>
                                <p className="text-center text-sm mt-2">Sent by: {item.userName}</p>
                                <p className="text-center text-sm">Sent at: {item.timestamp}</p>
                            </div>
                        )
                    })}
                </>
            }
        </div>
    );
}
