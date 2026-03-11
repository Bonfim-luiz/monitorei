def user_matching_logic(user_list, target_user):
    """
    Match a target user with a list of users.
    This function checks if the target user is present in the user list and returns the matching user.
    """
    return target_user if target_user in user_list else None

# Example usage
if __name__ == '__main__':
    users = ['alice', 'bob', 'charlie']
    target = 'bob'
    matched_user = user_matching_logic(users, target)
    if matched_user:
        print(f'Matched user: {matched_user}')
    else:
        print('No match found.')