import os
import re

dir_path = r"c:\Users\djima\Mel projet\Bot\mel\Documentation Ghotbuster\Documentation Ghotbuster"

def replace_placeholders():
    pattern = re.compile(r"https://via\.placeholder\.com/[a-zA-Z0-9?=+]+")
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.html') or file.endswith('.js'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = pattern.sub('images/placeholder.svg', content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

replace_placeholders()
