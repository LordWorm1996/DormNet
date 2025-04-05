interface User {
    id: string;
    username: string;
    name: string;
    surname: string;
    email: string;
    joinDate: string;
    lastLogin?: string;
    role: 'user' | 'admin';
    status: 'active' | 'inactive';
}

// Mock database of users
const mockUsersDatabase: User[] = [
    {
        id: '1',
        username: 'johndoe',
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        joinDate: '2023-01-15T10:30:00Z',
        lastLogin: '2023-06-20T14:25:00Z',
        role: 'admin',
        status: 'active'
    },
    {
        id: '2',
        username: 'janesmith',
        name: 'Jane',
        surname: 'Smith',
        email: 'jane.smith@example.com',
        joinDate: '2023-02-20T09:15:00Z',
        lastLogin: '2023-06-18T11:45:00Z',
        role: 'user',
        status: 'active'
    },
    {
        id: '3',
        username: 'bobjohnson',
        name: 'Bob',
        surname: 'Johnson',
        email: 'bob.johnson@example.com',
        joinDate: '2023-03-10T14:00:00Z',
        role: 'user',
        status: 'inactive'
    }
];

export async function getUserByUsername(username: string): Promise<User | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Find user in mock database
    const user = mockUsersDatabase.find(user => user.username === username);

    // Return null if user not found
    if (!user) {
        console.warn(`User with username ${username} not found`);
        return null;
    }

    // Return user data without password (for security)
    return {
        id: user.id,
        username: user.username,
        name: user.name,
        surname: user.surname,
        email: user.email,
        joinDate: user.joinDate,
        lastLogin: user.lastLogin,
        role: user.role,
        status: user.status
    };
}

// Additional helper function to get all users (optional)
export async function getAllUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsersDatabase.map(user => ({
        id: user.id,
        username: user.username,
        name: user.name,
        surname: user.surname,
        email: user.email,
        joinDate: user.joinDate,
        lastLogin: user.lastLogin,
        role: user.role,
        status: user.status
    }));
}