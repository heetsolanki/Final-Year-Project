import { Users } from "lucide-react";
import UserRow from "./UserRow";

const UserTable = ({ users, onAction, actionLoading }) => {
  return (
    <div className="rounded-xl border border-gray-100 overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Location
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Joined
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-16 text-gray-400">
                <Users size={36} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">No users found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try adjusting your search or filters
                </p>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <UserRow
                key={user._id}
                user={user}
                onAction={onAction}
                actionLoading={actionLoading}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
