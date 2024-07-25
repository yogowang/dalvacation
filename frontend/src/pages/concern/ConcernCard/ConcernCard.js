import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ChatModal } from '../ChatModal/ChatModal';
import axios from 'axios';
import { REACT_APP_BACKEND_URL } from "../../../ApiUrl.js"

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

export const ConcernCard = ({ concern, user_type }) => {
    const [open, setOpen] = React.useState(false);
    const [chat, setChat] = React.useState();

    const handleClose = () => setOpen(false);

    const handleOpen = async () => {
        try {
            const payload = {
                message_id: concern.message_id
            }
            const response = await axios.post(`${REACT_APP_BACKEND_URL}/concern/getconcernchat`, payload)

            setChat(JSON.parse(response.data.body).chat);
            setOpen(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Card sx={{ minWidth: 275 }} className="mt-4" >
            <CardContent>
                <Typography variant="h5" component="div">
                    Booking Reference Code: {concern.booking_reference_code}
                </Typography>
                <Typography variant="body2">
                    Property Agent Email: {concern.property_agent_email}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleOpen}>Chat</Button>
                <ChatModal open={open} handleOpen={handleOpen} handleClose={handleClose} chat={chat} user_type={user_type} message_id={concern.message_id} />
            </CardActions>
        </Card>
    )
}
