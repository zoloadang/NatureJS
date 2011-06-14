#coding:utf-8
#author nanzhi<nanzhienai@163.com>

import re, os, sys, itertools
import os.path

#get relative path (learn from http://hi.baidu.com/tinylee/blog/item/763177c6820444199c163da8.html, thanks)
def all_equal(elements):
    return len(set(elements)) == 1

def common_prefix(*sequences):
    # if there are no sequences at all, we're done
	#print sequences
	if not sequences: 
		return [], []
    # loop in parallel on the sequences 
	common = []
	for elements in itertools.izip(*sequences): 
		#print elements
        # unless all elements are equal, bail out of the loop 
		if not all_equal(elements): 
			break
        # got one more common element, append it and keep looping 
		common.append(elements[0])
    # return the common prefix and unique tails 
	#print common
	#print [ sequence[len(common) - 1:] for sequence in sequences ]
	return common, [ sequence[len(common):] for sequence in sequences ]

def relpath(p1, p2, sep=os.path.sep, pardir=os.path.pardir):

	common, (u1, u2) = common_prefix(p1.split(sep), p2.split(sep))

	return sep.join([pardir] * len(u1) + u2)

#get arg
def getArg():
	#获取输出路径
	args = sys.argv
	#匹配路径
	rootReg = re.compile(r'root=')
	tempReg = re.compile(r'template=')
	outReg = re.compile(r'out=')
	for arg in args:
		#文件夹目录
		if rootReg.search(arg):
			rootdir = rootReg.sub('', arg)
		#模板文件
		if tempReg.search(arg):
			template = tempReg.sub('', arg)
		#输出目录
		if outReg.search(arg):
			outdir = outReg.sub('', arg)
			if not os.path.exists(outdir):
				os.mkdir(outdir)
	return rootdir, outdir, template

#get description
def getDesc(source):
	desc = re.compile(r'\s*\*\s*@fileoverview\s*(.+)(\n|\r)')
	ret = desc.findall(source)
	if ret:
		return ret[0][0]

#check spec start
def checkStart(line):
	start = re.compile(r'\s*\*\s*@spec\s*')
	return start.search(line)

#check spec end
def checkEnd(line):
	end = re.compile(r'^\s+\*\s*/')
	return end.search(line)

#check example start
def checkAt(line):
	at = re.compile(r'\s*\*\s*@')
	return at.search(line)

#get postfix
def getPostfix(str):
	post = re.compile(r'([^.]+\.)+([^.]+)$')
	return post.sub(r'\2', str)

#get spec
def getSpec(source):

	#结果
	ret = []
	specList = []
	specDesc = ''

	#匹配换行
	wrap = re.compile(r'(\r|\n)')

	#是否是用例
	isCase = 0

	#匹配注释行首
	tab = re.compile(r'\s*\t*\*\s*\t*')

	#匹配 spec
	spec = re.compile(r'\s*\*\s*@spec\s*')

	for line in source:

		#end
		if checkEnd(line) or (checkAt(line) and isCase > 2):
#			print line
#			print exampleEnd.match(line)
			isCase = 0
			if len(specList) > 0:
				specList.insert(0, specDesc)
				ret.append(specList)
				specList = []
				specDesc = ''

		#匹配 spec description
		if spec.match(line):
			specDesc = wrap.sub('', line)
			specDesc = spec.sub('', specDesc)

		#匹配用例
		if isCase:
			isCase += 1
			if not checkAt(line) or isCase > 2:
				specList.append(tab.sub('', line))

		#start
		if checkStart(line):
#			print line 
#			print exampleStart.match(line)
			isCase = 1

	return ret

#crate spec
def createSpec(ret, source, fname, arg):

	#参数
	rootdir = arg[0]
	outdir = arg[1]
	template = arg[2]

	#空格
	space = '    '

	#匹配换行
	wrap = re.compile(r'(\r|\n)')

	#缩进个数
	ident = 1

	#代码
	code = []

	#匹配注释中心
	center = re.compile(r'\s*;?\s*=>\s*')

	#匹配模板
	jasmineTag = re.compile(r'\{JASMINE_CASE\}')

	#匹配 js 地址
	jspath = re.compile(r'\{JS_PATH\}')

	#匹配 js 文件名
	jsname = re.compile(r'\{JS_NAME\}')

	#匹配后缀
	postfix = re.compile(r'(\..+)+')


	if len(ret) > 0:

		#生成代码
		code.append('describe("' + wrap.sub('', getDesc(source)) + '", function() {')
		ident += 2

		for alone in ret:

			code.append('\n\n')

			code.append(ident * space)
			ident += 1

			code.append('it("' + alone.pop(0) + '", function() {')

			code.append('\n')

			for case in alone:
				text = wrap.sub('', case)
				code.append(ident * space)
				if center.search(text):
					code.append('expect(' + center.sub(').toBe(', text, 1) + ');')
				else:
					code.append(text);
				code.append('\n')

			ident -= 1
			code.append(ident * space)
			code.append('});')

		code.append('\n\n')
		ident -= 1
		code.append(ident * space)
		code.append('});')

#		print code

		#生成文件
		fi = open(template, 'r')
		html = fi.read()

		#replace src
		if jspath.search(html):
			html = jspath.split(html)
			rel = relpath(outdir, rootdir, '/') + '/' + fname
			html.insert(1, rel)
			html = ''.join(html)

		testFi = open(outdir + '/' + fname + '.' + getPostfix(template), 'w')
		html = jsname.sub(postfix.sub('', fname), html)
		testFi.write(jasmineTag.sub(''.join(code), html))
		testFi.close()
		fi.close()

#run
def run():
	arg = getArg()
	for parent, dirnames, filename in os.walk(arg[0]):
		for f in filename:
			path = os.path.join(parent, f)
			#获取用例
			ret = getSpec(open(path, 'r').readlines())
			#生成用例
			createSpec(ret, open(path, 'r').read(), f, arg)

if __name__ == '__main__':
	run()
