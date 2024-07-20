import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import axios from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const RaiseConcernModal = ({ open, handleOpen, handleClose, email }) => {
    const [inputText, setInputText] = React.useState('');

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleRaiseConcern = async () => {
        if (inputText.trim() !== '') {
            try {
                const payload = {
                    booking_reference_code: inputText,
                    customer_email: email
                }
                const response = await axios.post('https://us-central1-dalvacationhome-429614.cloudfunctions.net/customer-concern-publisher', payload);
                handleClose(true);
            } catch (error) {
                console.log(error);
            }
            setInputText('');
        }
    };
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Raise Concern
                    </Typography>
                    <Box sx={{ display: 'flex', marginTop: '20px' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={inputText}
                            onChange={handleInputChange}
                            placeholder="Booking Reference Code"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRaiseConcern}
                            sx={{ marginLeft: '10px' }}
                        >
                            Raise
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}