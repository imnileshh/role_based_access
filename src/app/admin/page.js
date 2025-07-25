function AdminPage() {
    // const session = await getServerSession(options);
    // // console.log('Your Session is:', session);
    // if (session?.user?.role !== 'admin') {
    //     redirect('/restricted');
    // }
    return (
        <div className="text-white">
            <h1 className="text-5xl text-white">This IS Admin Page</h1>
            <p>Role: {session.user.role}</p>
            <p> email: {session.user.email}</p>
        </div>
    );
}

export default AdminPage;
