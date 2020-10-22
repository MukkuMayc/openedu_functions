import string
import random

def generate_string(length, alphabet=string.ascii_letters):
    return ''.join(random.choice(alphabet) for i in range(length))

def generate_alphanumeric(length):
    return generate_string(length, alphabet=string.ascii_letters + string.digits)

def create_invite(username, email, last_name, first_name, second_name = '', student_id = '', group = ''):
    return ';'.join([username, email, last_name, first_name, second_name, student_id, group])

# this function generate random csv file field with: username, email, last_name, first_name 
def generate_invite():
    username = generate_alphanumeric(8)
    email = '{}@{}.ru'.format(generate_string(10), generate_string(4))
    last_name = generate_string(6)
    first_name = generate_string(6)
    return create_invite(username, email, last_name, first_name)

if __name__ == '__main__':
    f = open('invite.csv', "w")
    f.write(generate_invite() + '\n')
    f.write(generate_invite() + '\n')
    f.write(generate_invite())