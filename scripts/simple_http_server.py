from http.server import SimpleHTTPRequestHandler, HTTPServer
import os

class MyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # If request path doesn't have extension, try adding .html
        if not os.path.splitext(self.path)[1]:  
            print("Looking for path: ", self.path)
            # remove leading slash
            candidate = self.path.lstrip("/") + ".html"
            if os.path.exists(candidate):
                self.path = "/" + candidate

        return super().do_GET()

if __name__ == "__main__":
    port = 8000
    script_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(script_dir)
    os.chdir(parent_dir) # serve parent directory
    httpd = HTTPServer(("0.0.0.0", port), MyHandler)
    print(f"Serving on port {port} at folder {parent_dir} by python script in {script_dir}")
    httpd.serve_forever()
