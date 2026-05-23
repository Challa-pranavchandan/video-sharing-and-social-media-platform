import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function test() {
    try {
        const form = new FormData();
        form.append('username', 'testuser123');
        form.append('email', 'test12345@test.com');
        form.append('fullname', 'Test User');
        form.append('password', 'password123');
        // create a dummy file for avatar
        fs.writeFileSync('dummy.jpg', 'fake image content');
        form.append('avatar', fs.createReadStream('dummy.jpg'));

        const res = await axios.post('http://localhost:8000/api/v1/users/register', form, {
            headers: form.getHeaders()
        });
        console.log(res.status, res.data);
    } catch (e) {
        console.error("REGISTER ERROR:", e.response ? e.response.status + " " + JSON.stringify(e.response.data) : e.message);
    }

    try {
        const res2 = await axios.post('http://localhost:8000/api/v1/users/login', {
            email: 'testuser123',
            password: 'password123'
        });
        console.log("LOGIN:", res2.status, res2.data);
    } catch (e) {
        console.error("LOGIN ERROR:", e.response ? e.response.status + " " + JSON.stringify(e.response.data) : e.message);
    }
}
test();
