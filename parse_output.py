from json import load
from csv import DictWriter
from argparse import ArgumentParser


parser = ArgumentParser(description='Process facebook birthday output to csv.')
parser.add_argument("input")
parser.add_argument("output")

args = parser.parse_args()


with open(args.input, "r") as json_file:
    facebook_data = load(json_file)

fieldnames = ["senderName", "senderProfile", "time", "message"]
with open(args.output, "w") as output_csv:
    writer = DictWriter(output_csv, fieldnames = fieldnames)
    writer.writeheader()
    writer.writerows(facebook_data)
