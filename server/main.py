from config.config import Config

def main():
    config = Config()
    print("Hello from server!")
    print(config.get_config())


if __name__ == "__main__":
    main()
