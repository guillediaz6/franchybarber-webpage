import re
import os

def process_html_file(html_path, css_path, js_path, css_href, js_src):
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract and replace style
    style_pattern = re.compile(r'<style>(.*?)</style>', re.DOTALL)
    style_match = style_pattern.search(content)
    if style_match:
        css_content = style_match.group(1)
        # Update urls in CSS
        css_content = css_content.replace('url(\'fondo.png\')', 'url(\'../img/fondo.png\')')
        css_content = css_content.replace('url(\'portada.jpeg\')', 'url(\'../img/portada.jpeg\')')
        css_content = css_content.replace('url(\'historia_barber.jpg\')', 'url(\'../img/historia_barber.jpg\')')
        
        os.makedirs(os.path.dirname(css_path), exist_ok=True)
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(css_content.strip() + '\n')
            
        content = content[:style_match.start()] + f'<link rel=\"stylesheet\" href=\"{css_href}\">' + content[style_match.end():]

    # Extract and replace script
    script_pattern = re.compile(r'<script>(.*?)</script>', re.DOTALL)
    script_match = script_pattern.search(content)
    if script_match:
        js_content = script_match.group(1)
        
        os.makedirs(os.path.dirname(js_path), exist_ok=True)
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content.strip() + '\n')
            
        content = content[:script_match.start()] + f'<script src=\"{js_src}\"></script>' + content[script_match.end():]

    # Replace image src in HTML
    content = re.sub(r'src=\"logo\.png\"', 'src=\"img/logo.png\"', content)
    content = re.sub(r'src=\"letrero\.png\"', 'src=\"img/letrero.png\"', content)
    content = re.sub(r'src=\"portada\.jpeg\"', 'src=\"img/portada.jpeg\"', content)
    content = re.sub(r'src=\"historia_barber\.jpg\"', 'src=\"img/historia_barber.jpg\"', content)
    # Also handle gallery images: gallery-1.jpg, etc.
    content = re.sub(r'src=\"(gallery-\d+\.jpg)\"', r'src=\"img/\1\"', content)

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)

process_html_file('index.html', 'css/styles.css', 'js/main.js', 'css/styles.css', 'js/main.js')
process_html_file('historia.html', 'css/historia.css', 'js/historia.js', 'css/historia.css', 'js/historia.js')
print('Extraction and replacement complete.')
