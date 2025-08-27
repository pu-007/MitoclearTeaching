# 设置默认目标为build
.DEFAULT_GOAL := build

# 应用配置变量
APP_NAME := MitoTeach
INDEX_FILE := ./index.html
ICON_FILE := ./favicon.ico
APP_TITLE := "有丝分裂互动教学平台"
# 默认构建目标架构，可通过命令行覆盖
TARGETS ?= x64
# 语言设置，默认中文，可通过命令行覆盖
LANGUAGE ?= "zh-CN"
# 调试模式开关，默认关闭
DEBUG ?= 0

# 根据DEBUG变量决定是否添加--debug参数
DEBUG_FLAG := $(if $(filter 1,$(DEBUG)),--debug,)

# 判断目标是否为Windows平台（x64或arm64）
WINDOWS_TARGETS := x64 arm64
ifneq ($(filter $(WINDOWS_TARGETS),$(TARGETS)),)
    # 目标为Windows平台时使用pwsh.exe
    PAKE_CMD := pwsh.exe -Command pake
else
    # 其他目标使用直接命令
    PAKE_CMD := pake
endif

# 构建目标
build:
	$(PAKE_CMD) $(INDEX_FILE) --name $(APP_NAME) --icon $(ICON_FILE) --always-on-top --targets $(TARGETS) --title $(APP_TITLE) --use-local-file --installer-language $(LANGUAGE) $(DEBUG_FLAG)

# 清理构建产物
clean:
	rm -rf MitoTeach.msi

# 伪目标声明
.PHONY: build clean
