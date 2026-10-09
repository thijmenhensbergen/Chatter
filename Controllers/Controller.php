<?php

namespace Controllers;

use PDO;
use PDOException;

class Controller
{
    public function roomlist() 
    {
        buildTemplate('RoomList.twig');
    }
    public function room() 
    {
        buildTemplate('Room.twig');
    }
    public function account() 
    {
        buildTemplate('account.twig');
    }
    public function register() 
    {
        buildTemplate('register.twig');
    }
    public function registerPost()
    {
        $host = '127.0.0.1';
        $username = "bit_academy";
        $password = "bit_academy";
        $dbname = "chatter";
        try {
            $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo "Connected successfully";
            $name = $_POST["username"];
            $pass = $_POST["password"];
            $hashed_password = password_hash($pass, PASSWORD_BCRYPT);
            $token = bin2hex(random_bytes(20));

            $sql = "INSERT INTO users (Name, Password, PFPURL, Token) VALUES (:name, :password, :pfpurl, :token)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':name' => $name,
                ':password' => $hashed_password,
                ':pfpurl' => 'https://ui-avatars.com/api/?name=' . urlencode($name),
                ':token' => $token
            ]);

            $conn = null;
            echo "<script>
                    localStorage.setItem('accountToken', " . json_encode($token) . ");
                    console.log('Saved Token');
                    window.location.href = '/';
                </script>";
            exit();
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }
    public function login()
    {
        buildTemplate('login.twig');
    }
    public function loginPost()
    {
        $host = '127.0.0.1';
        $username = "bit_academy";
        $password = "bit_academy";
        $dbname = "chatter";
        
        try {
            $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            $name = $_POST["username"] ?? '';
            $pass = $_POST["password"] ?? ''; 

            $stmt = $conn->prepare("SELECT Name, Password, Token FROM users WHERE Name = :name LIMIT 1");
            $stmt->execute([':name' => $name]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($pass, $user['Password'])) {
                $conn = null;
                
                echo "<script type='text/javascript'>
                        try {
                            localStorage.setItem('accountToken', " . json_encode($user['Token']) . ");
                            console.log('Saved Token');
                            window.location.replace('/');
                        } catch(e) {
                            console.error('Localstorage error', e);
                        }
                    </script>";
                exit();
            } else {
                $conn = null;
                echo "Wrong username or password";
            }
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }
    public function admin()
    {
        buildTemplate('admin.twig');
    }
}


?>