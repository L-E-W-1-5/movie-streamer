import {type User} from '../../Types/Types.ts'





const UserView: React.FC<{user: User}> = ({ user }) => {




    return(
        <div className="d-flex flex-column variable-colour gap-1">
            <span>{user.id}</span>
            <span>{user.name}</span>
            <span>{user.guid}</span>
            <span>{user.email}</span>
            <span>{`verified: ${user.is_verified}`}</span>
            <span>{`admin: ${user.is_admin}`}</span>

            <div className="align-self-center d-flex gap-3">

                <button className="btn border-shadow variable-colour">make admin</button>
                <button className="btn border-shadow variable-colour">verify</button>
                <button className="btn border-shadow variable-colour">delete</button>

            </div>

        </div>
    )
}

export default UserView;