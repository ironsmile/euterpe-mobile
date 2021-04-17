package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatalf("Usage: %s [PATH-to-package.json]", os.Args[0])
	}

	packageJSONFile := os.Args[1]

	fh, err := os.Open(packageJSONFile)
	if err != nil {
		log.Fatalf("error opening: %s", err)
	}
	defer fh.Close()

	var pkg jsonPackage
	dec := json.NewDecoder(fh)
	if err := dec.Decode(&pkg); err != nil {
		log.Fatalf("error decoding JSON: %s", err)
	}

	for npmPkg, verSpec := range pkg.Dependencies {
		fmt.Printf(
			"<Text style={styles.text}>%s (%s)</Text>\n",
			npmPkg,
			verSpec,
		)
	}
}

type jsonPackage struct {
	Dependencies map[string]string `json:"dependencies"`
}
