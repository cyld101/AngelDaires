from docx import Document

# Path to your docx and html files
docx_path = "/Users/dev1/Documents/Coding/Selina/product-list.docx"
html_path = "/Users/dev1/Documents/Coding/Selina/products.html"

def docx_to_html(docx_path):
    doc = Document(docx_path)
    html = []
    for para in doc.paragraphs:
        text = para.text.strip()
        if text.startswith("###"):
            html.append(f'<h2>{text[3:].strip()}</h2>')
        elif text.startswith("- "):
            html.append(f'<div class="product"><h3>{text[2:].strip()}</h3></div>')
    return "\n".join(html)

def update_html(html_path, new_products_html):
    with open(html_path, "r") as f:
        lines = f.readlines()
    # Find the product-list section and replace it
    start = None
    end = None
    for i, line in enumerate(lines):
        if '<div class="product-list">' in line:
            start = i
        if start is not None and '</div>' in line and i > start:
            end = i
            break
    if start is not None and end is not None:
        # Replace the product-list content
        lines[start+1:end] = [new_products_html + "\n"]
        with open(html_path, "w") as f:
            f.writelines(lines)
        print("Products updated in HTML!")
    else:
        print("Could not find product-list section in HTML.")

if __name__ == "__main__":
    products_html = docx_to_html(docx_path)
    update_html(html_path, products_html)