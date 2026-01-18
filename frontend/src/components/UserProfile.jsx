import "../stylesheets/App.css"

export default function Profile({user}) {
    if (!user) return null;

    return (
        <div id="userData">
            <h3>Name: </h3>
            <h3>{user.name}</h3>
            <br/>
            <h3>Email: </h3>
            <h3>{user.email}</h3>
            <br/>
        </div>
    );
}