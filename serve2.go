package main

import (
	"fmt"
	"io/ioutil"
	"io"
	"log"
	"net/http"
	"regexp"
)

func copyHeader(dst, src http.Header) {
	for k, vv := range src {
		for _, v := range vv {
			dst.Add(k, v)
		}
	}
}

func handler(w http.ResponseWriter, r *http.Request) {

	filename := r.URL.Path[1:]
	fmt.Println(filename)
	data, err := ioutil.ReadFile(filename)

	if err != nil {
		http.NotFound(w, r)
		return
	}
	
	w.Header().Set("Content-Type", "text/html")
	w.Write(data)

}

func main() {

	var s http.ServeMux

	var esPath = regexp.MustCompile("^/elasticsearch/")
	var grPath = regexp.MustCompile("^/risk-graph/")
	var gtPath = regexp.MustCompile("^/threat-graph/")
	var fairPath = regexp.MustCompile("^/fair/")

	s.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		
//		if r.URL.Path == "/" { r.URL.Path = "/index.html" }

//		fmt.Println(r.URL.Path)

		if m := esPath.FindStringSubmatch(r.URL.Path); m != nil {

			path := r.URL.Path[15:]

			r.URL.Path = path
			r.URL.Host = "localhost:9200"
			r.URL.Scheme = "http"

			resp, err := http.DefaultTransport.RoundTrip(r)

			if err != nil {
				log.Printf("503: %s", err.Error())
				http.Error(w, err.Error(),
					http.StatusServiceUnavailable)
				return
			}

			defer resp.Body.Close()
			copyHeader(w.Header(), resp.Header)
			w.WriteHeader(resp.StatusCode)
			io.Copy(w, resp.Body)
			return

		}

		if m := grPath.FindStringSubmatch(r.URL.Path); m != nil {

			path := r.URL.Path[11:]

			fmt.Println(path)

			r.URL.Path = path
			r.URL.Host = "localhost:8082"
			r.URL.Scheme = "http"

			resp, err := http.DefaultTransport.RoundTrip(r)

			if err != nil {
				log.Printf("503: %s", err.Error())
				http.Error(w, err.Error(),
					http.StatusServiceUnavailable)
				return
			}

			defer resp.Body.Close()
			copyHeader(w.Header(), resp.Header)
			w.WriteHeader(resp.StatusCode)
			io.Copy(w, resp.Body)
			return

		}

		if m := gtPath.FindStringSubmatch(r.URL.Path); m != nil {

			path := r.URL.Path[13:]

			fmt.Println(path)

			r.URL.Path = path
			r.URL.Host = "localhost:8081"
			r.URL.Scheme = "http"

			resp, err := http.DefaultTransport.RoundTrip(r)

			if err != nil {
				log.Printf("503: %s", err.Error())
				http.Error(w, err.Error(),
					http.StatusServiceUnavailable)
				return
			}

			defer resp.Body.Close()
			copyHeader(w.Header(), resp.Header)
			w.WriteHeader(resp.StatusCode)
			io.Copy(w, resp.Body)
			return

		}

		if m := fairPath.FindStringSubmatch(r.URL.Path); m != nil {

			path := r.URL.Path[6:]

			fmt.Println(path)

			r.URL.Path = path
			r.URL.Host = "localhost:9876"
			r.URL.Scheme = "http"

			resp, err := http.DefaultTransport.RoundTrip(r)

			if err != nil {
				log.Printf("503: %s", err.Error())
				http.Error(w, err.Error(),
					http.StatusServiceUnavailable)
				return
			}

			defer resp.Body.Close()
			copyHeader(w.Header(), resp.Header)
			w.WriteHeader(resp.StatusCode)
			io.Copy(w, resp.Body)
			return

		}

		{
			path := r.URL.Path

			fmt.Println(path)

			r.URL.Path = path
			r.URL.Host = "localhost:4200"
			r.URL.Scheme = "http"

			resp, err := http.DefaultTransport.RoundTrip(r)

			if err != nil {
				log.Printf("503: %s", err.Error())
				http.Error(w, err.Error(),
					http.StatusServiceUnavailable)
				return
			}

			defer resp.Body.Close()
			copyHeader(w.Header(), resp.Header)
			w.WriteHeader(resp.StatusCode)
			io.Copy(w, resp.Body)
			return
		}						
//		http.NotFound(w, r)
//		return
	})

	log.Fatal(http.ListenAndServe(":8080", &s))

}
