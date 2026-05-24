path = '/Users/xanorchid/Desktop/xanadu/src/App.jsx'

with open(path, 'r') as f:
    src = f.read()

# Remove optional from intention label for all three roles
src = src.replace(
    '<span className="optional"> — optional</span>\n                    </label>',
    '</label>'
)

# Also catch the seeker version
src = src.replace(
    "Your intention\n                      <span className=\"optional\"> — optional</span>",
    "Your intention"
)

with open(path, 'w') as f:
    f.write(src)

print('✓ intention is now required in all forms')
