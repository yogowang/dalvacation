import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { List, ListItem, ListItemText, TextField } from '@mui/material';
import axios from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
};

export const ChatModal = ({ open, handleOpen, handleClose, chat, user_type, message_id }) => {
    const [inputText, setInputText] = React.useState('');

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleSendMessage = async () => {
        if (inputText.trim() !== '') {
            try {
                const payload = {
                    message_id,
                    user_type,
                    message: inputText
                }
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/concern/handleconcerncommunication`, payload);
                handleClose(true);
            } catch (error) {
                console.log(error);
            }
            setInputText('');
        }
    };

    const renderChat = () => {
        if (!chat || chat.length === 0) {
            return (
                <Typography variant="body1" component="p" style={{ textAlign: 'center', marginTop: '20px' }}>
                    No chat messages found.
                </Typography>
            );
        }

        const chatMessages = [];

        chat.forEach((message, index) => {
            if (message.customer) {
                chatMessages.push({
                    text: message.customer,
                    type: 'customer',
                });
            }
            if (message.property_agent) {
                chatMessages.push({
                    text: message.property_agent,
                    type: 'property_agent',
                });
            }
        });

        return chatMessages.map((message, index) => {
            const isCurrentUser = (message.type === 'customer' && user_type === 'customer') || (message.type === 'property_agent' && user_type === 'property_agent');

            return (
                <ListItem
                    key={index}
                    style={{
                        display: 'flex',
                        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                        marginBottom: '10px',
                    }}
                >
                    <ListItemText
                        primary={message.text}
                        style={{
                            textAlign: isCurrentUser ? 'right' : 'left',
                            backgroundColor: isCurrentUser ? '#f1f1f1' : '#e1f5fe',
                            padding: '10px',
                            borderRadius: '5px',
                            maxWidth: '80%',
                        }}
                    />
                </ListItem>
            );
        });

    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style, display: 'flex', flexDirection: 'column', height: '80vh' }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Chat
                    </Typography>
                    <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        {renderChat()}
                    </List>
                    <Box sx={{ display: 'flex', marginTop: '20px' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={inputText}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendMessage}
                            sx={{ marginLeft: '10px' }}
                        >
                            Send
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
