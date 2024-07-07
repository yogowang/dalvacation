import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { DeleteRoomDetails } from './DeleteRoomDetails/DeleteRoomDetails';

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

export const RoomDetailsCard = ({ room }) => {
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const redirectToUpdateRoomDetails = () => {
        navigate(`/update-room-details/${room.room_id}`);
    }

    return (
        <Card sx={{ minWidth: 275, margin: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    Room Number: {room.room_number}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {room.room_type}
                </Typography>
                <Typography variant="body2">
                    <ul>
                        {room.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </Typography>
            </CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button size="small" onClick={() => redirectToUpdateRoomDetails()}>Update</Button>
                <Button size="small" color="error" onClick={handleOpen}>Delete</Button>
                <DeleteRoomDetails open={open} handleClose={handleClose} room_id={room.room_id} room_number={room.room_number} />
            </CardActions>
        </Card>
    )
}