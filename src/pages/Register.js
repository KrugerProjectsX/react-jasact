import { Box, Typography } from "@mui/material";
import UserForm from "../components/UserForm";

export default function Register() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bgcolor="#f0f0f0"
        >
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <UserForm type={'create'} id={null}/>
        </Box>
    );
}
