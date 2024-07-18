import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

export const DeleteRoomDetails = ({ open, handleClose, room_id, room_number }) => {
    const navigate = useNavigate();

    const data = {
        room_id: room_id
    }

    const onSubmit = async () => {
        const deleteRoomDetailsAPIURL = `${process.env.REACT_APP_BACKEND_URL}booking/deleteroomdetails`;

        const response = await axios.post(deleteRoomDetailsAPIURL, data);
        console.log("delete response: ", response);

        handleClose();
        navigate(0);
    }

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
                        Delete
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to delete room {room_number}?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            onClick={onSubmit}
                            variant="outlined"
                            color="error">
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}